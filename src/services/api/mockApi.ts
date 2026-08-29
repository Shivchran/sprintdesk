import type { MockData } from "../../types";
import mockData from "../../data/mock-data.json";

export async function getMockData(): Promise<MockData> {
  return mockData as unknown as MockData;
}