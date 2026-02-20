export interface Rapport {
  idRapport: number;
  motif: string;
  bilan: string;
  date: string;
  nomMedecin: string;
  prenomMedecin: string;
  idMedecin: number;
}

export interface RapportCreate {
  idMedecin: number;
  motif: string;
  bilan: string;
  date: string;
  medicaments?: { [key: number]: number }; // { idMedicament: quantite }
}

export interface RapportUpdate {
  motif: string;
  bilan: string;
}
