import sanityApi from "./sanitySetup";
const fetchSongs = async () => {
  const data = await sanityApi.fetch(`*[_type == 'song']{
    active,
    artist,
    "audiofile":audiofile.asset->url,
    "coverfile":coverfile.asset->url,
    name,
    _id,
  }`);
  return data;
};
export default fetchSongs;
