
export const isStreetcarRoute = (routeId: string) => {
  routeId = routeId.replace(/\D/g, '');
  if (routeId.length > 2 && routeId.startsWith('5')) {
    return true;
  }
  return false
}

export const isExpressRoute = (routeId: string) => {
  routeId = routeId.replace(/\D/g, '');
  if (routeId.length > 2 && routeId.startsWith('9')) {
    return true;
  }
  return false;
}

export const isBlueNightRoute = (routeId: string) => {
  routeId = routeId.replace(/\D/g, '');
  if (routeId.length > 2 && routeId.startsWith('3')) {
    return true;
  }
  return false;
}

export const isShuttleRoute = (routeId: string) => {
  routeId = routeId.replace(/\D/g, '');
  if (routeId.length > 2 && routeId.startsWith('6')) {
    return true;
  }
  return false;
}

export const isSubwayRoute = (routeId: string) => {
  if (parseInt(routeId) < 5) {
    return true;
  }
  return false;
}

export const isLRTRoute = (routeId: string) => {
  if (!isSubwayRoute(routeId) && parseInt(routeId) < 7) {
    return true;
  }
}

export const isLocalRoute = (routeId: string) => {
  routeId = routeId.replace(/\D/g, '');
  if (isStreetcarRoute(routeId)) return false;
  if (isExpressRoute(routeId)) return false;
  if (isBlueNightRoute(routeId)) return false;
  return true;
}