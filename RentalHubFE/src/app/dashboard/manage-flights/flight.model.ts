export interface Flight {
  id: string;
  no: string;
  price: number;
  to_place: string;
  airline: string;
  departure_time: string;
  from_place: string;
  arrive_time: string;
  facilities: [string];
  seat: [SeatMap];
}

export interface SeatMap {
  '1': [boolean];
  '2 ': [boolean];
  '3': [boolean];
}
