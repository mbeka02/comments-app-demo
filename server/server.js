import fastify from "fastify";
import dotenv from "dotenv";
import sensible from "@fastify/sensible";
import cors from "@fastify/cors";
import cookie from "@fastify/cookie";
import { PrismaClient } from "@prisma/client";
dotenv.config();

const app = fastify();
app.register(sensible);
app.register(cookie, { secret: process.env.COOKIE_SECRET });
app.register(cors, {
  origin: process.env.CLIENT_URL,
  credentials: true,
});
app.addHook("onRequest", (req, res, done) => {
  if (req.cookies.userId !== CURRENT_USER_ID) {
    req.cookies.userId = CURRENT_USER_ID;
    res.clearCookie("userId");
    res.setCookie("userId", CURRENT_USER_ID);
  }
  done();
});
const prisma = new PrismaClient();
const CURRENT_USER_ID = (
  await prisma.user.findFirst({ where: { user: "Kyle" } })
).id;
const SELECT_FIELDS = {
  id: true,
  message: true,
  parentId: true,
  createdAt: true,
  user: {
    select: {
      id: true,
      user: true,
    },
  },
};

app.get("/posts", async (res, req) => {
  return await commitToDB(
    prisma.post.findMany({
      select: {
        id: true,
        title: true,
      },
    })
  );
});

app.get("/posts/:id", async (req, res) => {
  return await commitToDB(
    prisma.post
      .findUnique({
        where: { id: req.params.id },
        select: {
          body: true,
          title: true,
          comments: {
            orderBy: { createdAt: "desc" },
            select: { ...SELECT_FIELDS, _count: { select: { likes: true } } },
          },
        },
      })
      .then(async (post) => {
        const likes = await prisma.like.findMany({
          where: {
            userId: req.cookies.userId,
            commentId: { in: post.comments.map((comment) => comment.id) },
          },
        });
        return {
          ...post,
          comments: post.comments.map((comment) => {
            const { _count, ...commentFields } = comment;
            return {
              ...commentFields,
              likedByMe: likes.find((like) => like.commentId === comment.id),
              likeCount: _count.likes,
            };
          }),
        };
      })
  );
});
app.post("/posts/:id/comments", async (req, res) => {
  if (req.body.message == null || req.body.message === "") {
    return res.send(app.httpErrors.badRequest("message cannot be empty"));
  }
  return await commitToDB(
    prisma.comment
      .create({
        data: {
          message: req.body.message,
          userId: req.cookies.userId,
          parentId: req.body.parentId,
          postId: req.params.id,
        },
        select: SELECT_FIELDS,
      })
      .then((comment) => {
        return {
          ...comment,
          likedByMe: false,
          likeCount: 0,
        };
      })
  );
});

app.delete("/posts/:postId/comments/:commentId", async (req, res) => {
  const userId = await prisma.comment.findUnique({
    where: { id: req.params.commentId },
    select: { userId: true },
  });
  if (userId !== req.cookies.userId) {
    app.httpErrors.unauthorized(
      "You do not have permission to delete that comment"
    );
  }
  return await commitToDB(
    prisma.comment.delete({
      where: { id: req.params.commentId },
      select: { id: true },
    })
  );
});

app.put("/posts/:postId/comments/:commentId", async (req, res) => {
  if (req.body.message == null || req.body.message === "") {
    return res.send(app.httpErrors.badRequest("message cannot be empty"));
  }
  const userId = await prisma.comment.findUnique({
    where: { id: req.params.commentId },
    select: { userId: true },
  });

  if (userId !== req.cookies.userId) {
    app.httpErrors.unauthorized(
      "You do not have permission to delete that comment"
    );
  }

  return await commitToDB(
    prisma.comment.update({
      where: { id: req.params.commentId },
      data: { message: req.body.message },
      select: { message: true },
    })
  );
});
app.post("/posts/:postId/comments/:commentId/Upvote", async (req, res) => {
  const data = {
    commentId: req.params.commentId,
    userId: req.cookies.userId,
  };
  const like = await prisma.like.findUnique({
    where: { userId_commentId: data },
  });
  if (like == null) {
    return await commitToDB(prisma.like.create({ data })).then(() => {
      return { addLike: true };
    });
  }
});

app.post("/posts/:postId/comments/:commentId/Downvote", async (req, res) => {
  const data = {
    commentId: req.params.commentId,
    userId: req.cookies.userId,
  };
  const like = await prisma.like.findUnique({
    where: { userId_commentId: data },
  });
  if (like !== null) {
    return await commitToDB(
      prisma.like.delete({ where: { userId_commentId: data } })
    ).then(() => {
      return { addLike: false };
    });
  }
});

const commitToDB = async (param) => {
  const [error, data] = await app.to(param);
  if (error) return app.httpErrors.internalServerError(error.message);
  return data;
};
app.listen({ port: process.env.PORT });
