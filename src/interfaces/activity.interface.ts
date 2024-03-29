export interface Activity {
  id: string;
  title: string;
  description: string;
  isActive: boolean;
  time: number;
}

export interface AddActivity {
  title: string;
  description: string;
}
