import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import { ExtendableContent } from '@/types/content';

/**
 * Basic content loader that handles loading content files
 */
export class ContentLoader {
  /**
   * Static method to load page content
   * @param pageName Name of the page
   * @param language Language code
   * @returns Page content
   */
  public static async loadPageContent(pageName: string, language: string = 'en'): Promise<ExtendableContent> {
    const loader = new ContentLoader();
    const contentPath = `pages/${pageName}`;
    return loader.loadContent(contentPath, { language });
  }

  /**
   * Static method to load component content
   * @param componentName Name of the component
   * @returns Component content
   */
  public static async loadComponentContent<T>(componentName: string): Promise<T> {
    const loader = new ContentLoader();
    const contentPath = `components/${componentName}`;
    return loader.loadContent(contentPath) as Promise<T>;
  }

  /**
   * Static method to get available pages
   * @returns List of available page names
   */
  public static async getAvailablePages(): Promise<string[]> {
    const loader = new ContentLoader();
    return loader.getAvailablePages();
  }

  /**
   * Load content from a file
   * @param contentPath Path to the content file
   * @param options Loading options
   * @returns Parsed content
   */
  public async loadContent(contentPath: string, options = { language: 'en' }): Promise<ExtendableContent> {
    try {
      // Determine the full file path
      const filePath = this.resolveContentPath(contentPath, options.language);
      
      // Read and parse the file
      const fileContents = await fs.promises.readFile(filePath, 'utf-8');
      const content = yaml.load(fileContents);
      
      if (!content) {
        throw new Error(`Failed to parse content from ${filePath}`);
      }
      
      return content;
    } catch (error) {
      // Try fallback to default language if needed
      if (options.language !== 'en') {
        try {
          return await this.loadContent(contentPath, { language: 'en' });
        } catch {
          console.error(`Error loading content from ${contentPath}:`, error);
          throw new Error(`Failed to load content: ${contentPath}`);
        }
      }
      
      console.error(`Error loading content from ${contentPath}:`, error);
      throw new Error(`Failed to load content: ${contentPath}`);
    }
  }
  
  /**
   * Resolve the full path to a content file
   * @param contentPath Relative path to the content file
   * @param language Language code
   * @returns Full path to the content file
   */
  private resolveContentPath(contentPath: string, language: string): string {
    // Add file extension if not present
    if (!contentPath.endsWith('.yml') && !contentPath.endsWith('.yaml')) {
      contentPath = `${contentPath}.yml`;
    }
    
    // Check if this is already a full path
    if (contentPath.startsWith('/')) {
      return contentPath;
    }
    
    // Determine language-specific path if needed
    if (language !== 'en') {
      const pathParts = contentPath.split('.');
      const extension = pathParts.pop();
      const basePath = pathParts.join('.');
      
      // Try language-specific file first
      const languagePath = path.join(process.cwd(), 'content', `${basePath}.${language}.${extension}`);
      
      if (fs.existsSync(languagePath)) {
        return languagePath;
      }
    }
    
    // Default to standard path
    return path.join(process.cwd(), 'content', contentPath);
  }
  
  /**
   * Get all available pages in the content directory
   * @returns List of page names
   */
  public async getAvailablePages(): Promise<string[]> {
    try {
      const pagesDirectory = path.join(process.cwd(), 'content', 'pages');
      const files = await fs.promises.readdir(pagesDirectory);
      
      return files
        .filter(file => file.endsWith('.yml') || file.endsWith('.yaml'))
        .map(file => {
          // Remove extension
          const withoutExtension = file.replace(/\.(yml|yaml)$/, '');
          
          // Remove language suffix if present
          return withoutExtension.replace(/\.(en|es|pt)$/, '');
        })
        .filter(Boolean); // Remove empty strings
    } catch (error) {
      console.error('Error getting available pages:', error);
      return [];
    }
  }
}