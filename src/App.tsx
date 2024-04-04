import Scene from "./containers/scene";
import NavBar from "./containers/navBar";
import PlayerBlock from "./components/playerBlock";

const App = () => {
  return (
    <div className="flex flex-col h-screen">
      <NavBar />
      <main className="grow grid grid-cols-1 sm:grid-cols-[1fr,200px] md:grid-cols-[1fr,400px] lg:grid-cols-[1fr,600px] lg:grid-rows-1 gap-[2px] bg-[#242838]">
        {/* board */}
        <div id="scene-container" className="min-w-0 min-h-0">
          <Scene />
        </div>
        {/* player */}
        <div
          id="player-container"
          className="bg-[#353d57] grid grid-cols-1 grid-rows-[400px,1fr] lg:grid-rows-[250px,1fr]"
        >
          {/* player block */}
          <div className="grid grid-rows-2 grid-cols-1 lg:grid-rows-1 lg:grid-cols-2 gap-4 m-4">
            <PlayerBlock
              name="Peter Pan"
              photo="/test-icon.png"
              rank="2k"
              captures={8}
              stoneColor="black"
            />
            <PlayerBlock
              name="Chaoting Sun"
              photo="/test-icon.png"
              rank="1k"
              captures={2}
              stoneColor="white"
            />
          </div>
          {/* chat box */}
          <div className="rounded-2xl bg-[#4a587f] grid grid-rows-[1fr,120px] md:grid-rows-[1fr,60px] m-4">
            <div id="chatbox-content" className=""></div>
            <div
              id="chatbox-input"
              className="grid grid-rows-2 grid-cols-1 md:grid-rows-1 md:grid-cols-[1fr,90px] p-3 gap-3"
            >
              <input type="text" className="rounded p-2 outline-none" />
              <button className="bg-[#d2d6e5] p-2 flex justify-center items-center rounded">
                Send
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
