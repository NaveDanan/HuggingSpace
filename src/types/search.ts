export interface SearchResult {
  id: string;
  type: 'model' | 'dataset' | 'space';
  title: string;
  description: string;
  author: string;
}