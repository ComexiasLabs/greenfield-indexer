import fs from 'fs';

export const writeToJsonFile = (filePath: string, data: unknown) => {
  try {
    const jsonData = JSON.stringify(data, null, 2); // Indent for readability
    fs.writeFileSync(filePath, jsonData);
    
    console.log(`Successfully wrote data to ${filePath}`);
  } catch (e) {
    throw e; // Re-throw for further handling
  }
}
