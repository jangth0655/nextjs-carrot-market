import { PrismaClient } from "@prisma/client";

const client = new PrismaClient();

async function main() {
  [...Array.from(Array(26).keys())].forEach(async (item) => {
    const stream = await client.stream.create({
      data: {
        cloudflareId: item + "",
        cloudflareUrl: item + "",
        cloudflareKey: item + "",
        name: String(item),
        description: String(item),
        price: +item,
        user: {
          connect: {
            id: 4,
          },
        },
      },
    });
    console.log(`${item}/25`);
  });
}

main()
  .catch((e) => console.log(e))
  .finally(() => client.$disconnect);
