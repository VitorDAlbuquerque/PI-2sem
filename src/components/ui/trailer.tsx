import { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";



function Trailer({ ...props }) {
  const { trailer_id, handler_show_trailer, show_trailer } = props;

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
  }, [show_trailer]);

  

  return (
    <div className={` font-montserrat fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 ${show_trailer ? "block" : "hidden"}`}>
      <div className="bg-white rounded-lg overflow-hidden max-w-screen-lg w-full mx-4">
        <div className="flex justify-between items-center bg-mainBg text-mainFontColor p-4">
          <h2 className="text-xl ">Reproduzir trailer</h2>
          <button className="text-white" onClick={() => handler_show_trailer(false)}>Fechar</button>
        </div>
        {loading && <Skeleton className="p-5" height={500} />}
        <iframe
          style={{ border: "none", display: loading ? "none" : "block" }}
          onLoad={() => setLoading(false)}
          className="w-full"
          height="500px"
          src={`https://www.youtube.com/embed/${trailer_id}`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        ></iframe>
      </div>
    </div>
  );
}



export default Trailer;
