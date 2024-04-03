export interface Flight {
  id: string;
  no: string;
  price: number;
  to_place: string;
  airline: string;
  departure_time: {
    _seconds: number;
    _nanoseconds: number;
  };
  from_place: string;
  arrive_time: {
    _seconds: number;
    _nanoseconds: number;
  };
  seat: [SeatMap];
}

export interface SeatMap {
  '1': [boolean];
  '2 ': [boolean];
  '3': [boolean];
}
