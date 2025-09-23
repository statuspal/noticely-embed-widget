export type StatusResponse = {
  ongoing_notices: Notice[];
  services: Service[];
};

export type Notice = {
  id: string;
  title: string;
  notice_type: 'maintenance' | 'incident';
  starts_at: string;
  ends_at: string;
  severity?: 'major' | 'minor' | '';
  affected_services: { [key: string]: string[] };
};

export type Service = {
  id: string;
  name: string;
};
