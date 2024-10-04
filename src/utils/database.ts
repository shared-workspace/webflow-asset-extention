import * as fs from 'fs';

// Generic JsonDatabase class
class JsonDatabase<T> {
  private filePath: string;
  private data?: T[];

  constructor(filePath: string) {
    this.filePath = filePath;

    // Ensure the file exists
    if (!fs.existsSync(this.filePath)) {
      fs.writeFileSync(this.filePath, JSON.stringify([]), 'utf-8');
    } else this.read();
  }

  // Function to write data to the JSON file
  write(): void {
    if (!this.data) return; // Return if no data to write
    try {
      const jsonData = JSON.stringify(this.data, null, 2); // Convert data to JSON string
      fs.writeFileSync(this.filePath, jsonData, 'utf-8'); // Write JSON string to file
      console.log('Data successfully written to', this.filePath);
    } catch (err) {
      console.error('Error writing data to file:', err);
    }
  }

  // Function to read data from the JSON file
  read(): T[] {
    if (this.data) return this.data; // Return data if already read
    try {
      const jsonData = fs.readFileSync(this.filePath, 'utf-8'); // Read JSON string from file
      return this.data = JSON.parse(jsonData) as T[]; // Convert JSON string to array of T
    } catch (err) {
      console.error('Error reading data from file:', err);
      return [];
    }
  }

  getById(id: string): T | null {
    return this.data?.find((item: any) => item.id === id) || null;
  }

  update(id: string, key: keyof T, value: any) {
    const item = this.getById(id);
    if (item) {
      item[key] = value;
      this.write();
      this.read();
      return item[key] || null;
    }
    return null;
  }
}

export const db = new JsonDatabase<AssetData & {id: string}>("data.json");
db.update
