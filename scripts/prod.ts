import { neon } from "@neondatabase/serverless";
import "dotenv/config";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "@/db/schema";
import { randomUUID } from "crypto";

const sql = neon(process.env.DATABASE_URL as string);
const db = drizzle(sql, { schema });

const main = async () => {
  try {
    console.log("Seeding database...");

    // Delete all existing data in the correct order due to dependencies
    await db.delete(schema.notifications);
    await db.delete(schema.heatmapData);
    await db.delete(schema.reports);
    await db.delete(schema.users);

    console.log("All existing data deleted");

    // Insert sample users
    const userId1 = randomUUID();
    const userId2 = randomUUID();

    await db.insert(schema.users).values([
      { id: userId1, name: "Alice", email: "alice@example.com" },
      { id: userId2, name: "Bob", email: "bob@example.com" },
    ]);

    console.log("Sample users inserted");

    // Insert sample reports
    const reportId1 = randomUUID();
    const reportId2 = randomUUID();

    const reports = await db.insert(schema.reports).values([
      {
        id: reportId1,
        userId: userId1,
        province: "Aceh",
        city: "Kabupaten Simeulue",
        district: "Teupah Selatan",
        description: "Motor accident near the beach",
        status: "not_detected",
        createdAt: new Date(),
        image: "/images/sample1.jpg", // Example placeholder for image
      },
      {
        id: reportId2,
        userId: userId2,
        province: "JAWA BARAT",
        city: "KOTA BANDUNG",
        district: "CIBIRU",
        description: "Car accident on the main road",
        status: "detected",
        createdAt: new Date(),
        image: "/images/sample2.jpg", // Example placeholder for image
      },
    ]).returning();

    console.log("Sample reports inserted");

    // Insert sample notifications for each report
    for (const report of reports) {
      await db.insert(schema.notifications).values({
        id: randomUUID(),
        userId: report.userId,
        reportId: report.id,
        message: `Report ${report.description} has been ${
          report.status === "detected" ? "detected" : "submitted"
        }`,
        isRead: false,
        createdAt: new Date(),
      });
    }

    console.log("Sample notifications inserted");

    // Insert heatmap data for each report
    for (const report of reports) {
      const heatmapEntry = {
        id: randomUUID(),
        reportId: report.id,
        province: report.province,
        city: report.city,
        district: report.district,
        latitude:
          (report.province === "JAWA BARAT" && report.city === "KOTA BANDUNG"
            ? 2.38603
            : 2.51438).toString(), // Example latitude
        longitude:
          (report.province === "Aceh" && report.city === "Kabupaten Simeulue"
            ? 96.42904
            : 96.31197).toString(), // Example longitude
        timestamp: new Date(),
        intensity: report.status === "detected" ? 2 : 1, // Adjusted for intensity
      };

      await db.insert(schema.heatmapData).values(heatmapEntry);
    }

    console.log("Heatmap data inserted");
    console.log("Database seeded successfully");
  } catch (error) {
    console.error("Error during database seeding:", error);
  }
};

void main();
