/**
 * Wait the specified number of milliseconds
 * @param milliseconds
 * Example:
 *     1000
 */
export async function delay (milliseconds: number): Promise<void> {
  await new Promise(resolve => setTimeout(resolve, milliseconds))
}
