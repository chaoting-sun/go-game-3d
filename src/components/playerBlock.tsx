const PlayerBlock = ({ player, captures }) => {
  const colorClass =
    player.stoneColor === "black"
      ? "bg-gradient-to-r from-gray-700 to-black"
      : "bg-gradient-to-r from-gray-100 to-white";

  const textColor = player.stoneColor === "black" ? "text-slate-200" : "text-slate-800";

  return (
    <div className={`rounded-2xl flex justify-evenly items-center ${colorClass}`}>
      <div className="w-4/5 md:w-2/5 p-4">
        <img
          src={player.photo}
          alt=""
          className="h-[80%] aspect-square object-contain"
        />
      </div>
      <div className="w-3/5 flex flex-col hidden md:block">
        <h2 className={`text-xl ${textColor} `}>{player.name} [{player.rank}]</h2>
        <p className={`${textColor}`}>{captures} captures</p>
      </div>
    </div>
  );
};

export default PlayerBlock;
