import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';
import * as path from 'path';

export interface Coordinate {
  id: string;
  name: string;
  x: number;
  y: number;
  z: number;
  category: 'biome' | 'base' | 'resource';
  type: string;
  description?: string;
  addedBy: string;
  createdAt: string;
}

export interface CreateCoordinateDto {
  name: string;
  x: number;
  y: number;
  z: number;
  category: 'biome' | 'base' | 'resource';
  type: string;
  description?: string;
  addedBy: string;
}

@Injectable()
export class CoordinatesService {
  private readonly dataPath = path.join(__dirname, '../../data/coordinates.json');

  constructor() {
    this.ensureDataFile();
  }

  private ensureDataFile(): void {
    const dataDir = path.dirname(this.dataPath);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    if (!fs.existsSync(this.dataPath)) {
      fs.writeFileSync(this.dataPath, JSON.stringify([], null, 2));
    }
  }

  private readData(): Coordinate[] {
    try {
      const data = fs.readFileSync(this.dataPath, 'utf-8');
      return JSON.parse(data);
    } catch {
      return [];
    }
  }

  private writeData(data: Coordinate[]): void {
    fs.writeFileSync(this.dataPath, JSON.stringify(data, null, 2));
  }

  findAll(): Coordinate[] {
    return this.readData().sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  findByCategory(category: string): Coordinate[] {
    return this.readData()
      .filter(c => c.category === category)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  create(dto: CreateCoordinateDto): Coordinate {
    const coordinates = this.readData();
    const newCoordinate: Coordinate = {
      ...dto,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
    };
    coordinates.push(newCoordinate);
    this.writeData(coordinates);
    return newCoordinate;
  }

  delete(id: string): boolean {
    const coordinates = this.readData();
    const index = coordinates.findIndex(c => c.id === id);
    if (index === -1) return false;
    coordinates.splice(index, 1);
    this.writeData(coordinates);
    return true;
  }
}
