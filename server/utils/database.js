import { readFileSync, writeFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, '..', 'data');

// Generic JSON file operations
export function readJsonFile(filename) {
    try {
        const filepath = path.join(DATA_DIR, filename);
        const data = readFileSync(filepath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.error(`Error reading ${filename}:`, error.message);
        return null;
    }
}

export function writeJsonFile(filename, data) {
    try {
        const filepath = path.join(DATA_DIR, filename);
        writeFileSync(filepath, JSON.stringify(data, null, 2), 'utf-8');
        return true;
    } catch (error) {
        console.error(`Error writing ${filename}:`, error.message);
        return false;
    }
}

// Users
export function getUsers() {
    const data = readJsonFile('users.json');
    return data ? data.users : [];
}

// Projects
export function getProjects() {
    const data = readJsonFile('projects.json');
    return data ? data.projects : [];
}

export function saveProjects(projects) {
    return writeJsonFile('projects.json', { projects });
}

// Leads
export function getLeads() {
    const data = readJsonFile('leads.json');
    return data ? data.leads : [];
}

export function saveLeads(leads) {
    return writeJsonFile('leads.json', { leads });
}

// Generate slug from title
export function generateSlug(title) {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

// Generate unique ID
export function generateId(prefix = '') {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 8);
    return prefix ? `${prefix}-${timestamp}${random}` : `${timestamp}${random}`;
}
