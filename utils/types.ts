export type RawNode = {
  code: string;
  name: string;
  registration_date: string;
  introducer_code: string | null;
  l?: RawNode[];
  r?: RawNode[];
};