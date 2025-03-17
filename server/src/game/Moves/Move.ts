export interface Move {
  square: string;
  piece: string;
  color: "white" | "black";
  isCapture: boolean;
  isCheck: boolean;
}
