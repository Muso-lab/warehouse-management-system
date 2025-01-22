export interface User {
  _id?: string;
  username: string;
  password: string;  // Nota: nella UI mostreremo solo per nuovo utente/modifica
  role: 'admin' | 'ufficio' | 'magazzino' | 'monitor';
  active: boolean;
  createdAt?: Date;
}
