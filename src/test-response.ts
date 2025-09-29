import { StatusResponse } from 'types/general';

export default {
  status_page: {
    current_status: {
      notice_type: 'incident',
      severity: 'major'
    }
  },
  services: [
    {
      id: 'd3a3c5b2-78ee-481b-8f91-9db57e1cec8f',
      name: 'API'
    },
    {
      id: '5bda4caf-87aa-40e5-aa37-10f8db7dea56',
      name: 'Dashboard'
    },
    {
      id: '25cb6348-b395-44d5-b0bb-d2e2a95298c3',
      name: 'Web'
    }
  ],
  ongoing_notices: [
    {
      id: '6c3a609f-1cb2-4a99-94b6-2465060e1107',
      notice_type: 'incident',
      starts_at: '2025-08-12T08:32:52.000Z',
      ends_at: '2025-09-22T10:00:00.000Z',
      title: 'Demo major incident',
      severity: 'major',
      affected_services: {
        'd3a3c5b2-78ee-481b-8f91-9db57e1cec8f': ['EU', 'US'],
        '5bda4caf-87aa-40e5-aa37-10f8db7dea56': ['EU', 'US']
      }
    },
    {
      id: '902a938f-c500-470a-90c3-42fc95f1eb47',
      notice_type: 'incident',
      starts_at: '2025-09-22T15:18:06.385Z',
      ends_at: null,
      title: 'Demo minor incident',
      severity: 'minor',
      affected_services: {
        'd3a3c5b2-78ee-481b-8f91-9db57e1cec8f': ['EU', 'US'],
        '5bda4caf-87aa-40e5-aa37-10f8db7dea56': ['EU', 'US']
      }
    },
    {
      id: '39ab33bc-b554-411d-bf1f-008763944274',
      notice_type: 'incident',
      starts_at: '2025-09-22T09:49:00.494Z',
      ends_at: null,
      title: 'Demo incident without severity',
      severity: '',
      affected_services: {}
    },
    {
      id: '92ab8b35-9bf5-4f9c-8326-6a8c34dea06b',
      notice_type: 'maintenance',
      starts_at: '2025-09-22T15:18:00.000Z',
      ends_at: '2025-10-22T15:18:00.000Z',
      title: 'Demo maintenance',
      severity: null,
      affected_services: {}
    }
  ]
} as StatusResponse;
