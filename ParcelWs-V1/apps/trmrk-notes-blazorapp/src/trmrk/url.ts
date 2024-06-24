export const getBaseLocation = () => {
  let baseLocation = [window.location.protocol, window.location.host].join(
    "//"
  );

  return baseLocation;
};
