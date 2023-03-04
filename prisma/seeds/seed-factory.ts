import { PrismaClient } from "@prisma/client";

class PrismaClientSingleton {
  private static prismaInstance: PrismaClient;

  static getInstance() {
    if (!PrismaClientSingleton.prismaInstance) {
      this.prismaInstance = new PrismaClient();
      return this.prismaInstance;
    }

    return this.prismaInstance;
  }
}

function seedFactory(callback: (prisma: PrismaClient) => void) {
  // We can start the transaction here before returning the callback
  return callback(PrismaClientSingleton.getInstance());
}

seedFactory(async (prisma) => {
  const users = await prisma?.user.findMany({
    take: 10,
  });

  console.log(users);
});
