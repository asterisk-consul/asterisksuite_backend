export const COMBUSTIBLE_FLOW = {
  carga: {
    flowId: 11093,
    statusId: 1724,
    nextStatusId: 1723
  },
  descarga: {
    flowId: 11093,
    statusId: 1728,
    nextStatusId: 1723
  },
  ajuste: {
    plus: {
      flowId: 11093,
      statusId: 1729,
      nextStatusId: 1723
    },
    minus: {
      flowId: 11093,
      statusId: 1730,
      nextStatusId: 1723
    }
  }
} as const
