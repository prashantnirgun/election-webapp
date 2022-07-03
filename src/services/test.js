const heroesService = () => {
  let id = 20;

  function fun() {
    console.log("make fun");
  }

  return { fun };
};

const useHeroes = heroesService();
//const useHeroes = () => singleton;
export { useHeroes };
