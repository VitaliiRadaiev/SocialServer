-- CreateTable
CREATE TABLE "UserModel" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "login" TEXT NOT NULL,
    "followed" TEXT,
    "dialogs" TEXT
);

-- CreateTable
CREATE TABLE "UserPasswordModel" (
    "userId" INTEGER NOT NULL,
    "password" TEXT NOT NULL,
    CONSTRAINT "UserPasswordModel_userId_fkey" FOREIGN KEY ("userId") REFERENCES "UserModel" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ProfileModel" (
    "userId" INTEGER NOT NULL,
    "lookingForAJob" BOOLEAN NOT NULL,
    "lookingForAJobDescription" TEXT,
    "fullName" TEXT,
    "status" TEXT,
    CONSTRAINT "ProfileModel_userId_fkey" FOREIGN KEY ("userId") REFERENCES "UserModel" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ContactsModel" (
    "github" TEXT,
    "facebook" TEXT,
    "instagram" TEXT,
    "twitter" TEXT,
    "website" TEXT,
    "youtube" TEXT,
    "mainLink" TEXT,
    "profileId" INTEGER NOT NULL,
    CONSTRAINT "ContactsModel_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "ProfileModel" ("userId") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PhotosModel" (
    "small" TEXT,
    "large" TEXT,
    "profileId" INTEGER NOT NULL,
    CONSTRAINT "PhotosModel_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "ProfileModel" ("userId") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "DialogModel" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "members" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "MessageModel" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME,
    "userId" INTEGER NOT NULL,
    "text" TEXT NOT NULL,
    "dialogId" INTEGER NOT NULL,
    CONSTRAINT "MessageModel_dialogId_fkey" FOREIGN KEY ("dialogId") REFERENCES "DialogModel" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "UserModel_email_key" ON "UserModel"("email");

-- CreateIndex
CREATE UNIQUE INDEX "UserPasswordModel_userId_key" ON "UserPasswordModel"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "ProfileModel_userId_key" ON "ProfileModel"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "ContactsModel_profileId_key" ON "ContactsModel"("profileId");

-- CreateIndex
CREATE UNIQUE INDEX "PhotosModel_profileId_key" ON "PhotosModel"("profileId");
