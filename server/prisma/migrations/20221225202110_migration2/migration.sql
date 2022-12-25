-- CreateTable
CREATE TABLE "Picture" (
    "id" SERIAL NOT NULL,
    "file" TEXT NOT NULL,
    "file_name" TEXT NOT NULL,

    CONSTRAINT "Picture_pkey" PRIMARY KEY ("id")
);
