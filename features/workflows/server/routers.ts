import { NodeType } from "@/app/generated/prisma";
import { PAGINATION } from "@/config/constants";
import prisma from "@/lib/db";
import {
  createTRPCRouter,
  premiumProcedure,
  protectedProcedure,
} from "@/trpc/init";
import { Node, Edge } from "@xyflow/react";
import { generateSlug } from "random-word-slugs";
import z from "zod";

export const workflowsRouter = createTRPCRouter({
  create: premiumProcedure.mutation(({ ctx }) => {
    return prisma.workFlow.create({
      data: {
        name: generateSlug(3),
        userId: ctx.session.user.id,
        nodes: {
          create: {
            type: NodeType.INITIAL,
            position: {
              x: 0,
              y: 0,
            },
            name: NodeType.INITIAL,
          },
        },
      },
    });
  }),

  remove: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ ctx, input }) => {
      return prisma.workFlow.delete({
        where: {
          id: input.id,
          userId: ctx.session.user.id,
        },
      });
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        nodes: z.array(
          z.object({
            id: z.string(),
            type: z.string().nullish(),
            position: z.object({ x: z.number(), y: z.number() }),
            data: z.record(z.string(), z.any()).optional(),
          })
        ),
        edges: z.array(
          z.object({
            source: z.string(),
            target: z.string(),
            sourceHandle: z.string().nullish(),
            targetHandle: z.string().nullish(),
          })
        ),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, nodes, edges } = input;
      const workflow = await prisma.workFlow.findUniqueOrThrow({
        where: {
          id,
          userId: ctx.session.user.id,
        },
      });

      return await prisma.$transaction(async (tx) => {
        await tx.node.deleteMany({
          where: { workflowId: id },
        });

        await tx.node.createMany({
          data: nodes.map((node) => ({
            id: node.id,
            name: node.type || "unknown",
            workflowId: id,
            type: node.type as NodeType,
            position: node.position,
            data: node.data || {},
          })),
        });

        await tx.connection.createMany({
          data: edges.map((edge) => ({
            workflowId: id,
            fromNodeId: edge.source,
            toNodeId: edge.target,
            fromOutput: edge.sourceHandle || "main",
            toInput: edge.targetHandle || "main",
          })),
        });

        const updateWorkflows = await tx.workFlow.update({
          where: { id },
          data: { updatedAt: new Date() },
        });

        return updateWorkflows;
      });
    }),

  updateName: protectedProcedure
    .input(z.object({ name: z.string().min(1), id: z.string() }))
    .mutation(({ ctx, input }) => {
      return prisma.workFlow.update({
        where: {
          id: input.id,
          userId: ctx.session.user.id,
        },
        data: {
          name: input.name,
        },
      });
    }),

  getOne: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const workFlow = await prisma.workFlow.findUniqueOrThrow({
        where: {
          id: input.id,
          userId: ctx.session.user.id,
        },
        include: { nodes: true, connections: true },
      });
      const nodes: Node[] = workFlow.nodes.map((node) => ({
        id: node.id,
        type: node.type,
        position: node.position as { x: number; y: number },
        data: (node.data as Record<string, unknown>) || {},
      }));

      const edges: Edge[] = workFlow.connections.map((connection) => ({
        id: connection.id,
        source: connection.fromNodeId,
        target: connection.toNodeId,
        sourceHandle: connection.fromOutput,
        targetHandle: connection.toInput,
      }));
      return { id: workFlow.id, name: workFlow.name, nodes, edges };
    }),

  getMany: protectedProcedure
    .input(
      z.object({
        page: z.number().default(PAGINATION.DEFAULT_PAGE),
        pageSize: z
          .number()
          .min(PAGINATION.MIN_PAGE_SIZE)
          .max(PAGINATION.MAX_PAGE_SIZE)
          .default(PAGINATION.DEFAULT_PAGE_SIZE),
        search: z.string().default(""),
      })
    )
    .query(async ({ input, ctx }) => {
      const { page, pageSize, search } = input;
      const [items, totalCount] = await Promise.all([
        prisma.workFlow.findMany({
          skip: (page - 1) * pageSize,
          take: pageSize,
          where: {
            userId: ctx.session.user.id,
            name: {
              contains: search,
              mode: "insensitive",
            },
          },
          orderBy: {
            updatedAt: "desc",
          },
        }),
        prisma.workFlow.count({
          where: {
            userId: ctx.session.user.id,
            name: {
              contains: search,
              mode: "insensitive",
            },
          },
        }),
      ]);

      const totalPages = Math.ceil(totalCount / pageSize);
      const hasNextPage = page < totalPages;
      const hasPreviousPage = page > 1;

      return {
        items,
        pageSize,
        page,
        totalCount,
        totalPages,
        hasNextPage,
        hasPreviousPage,
      };
    }),
});
