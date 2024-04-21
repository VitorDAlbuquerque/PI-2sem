import { FormEvent, useContext, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { LoginContext } from "@/context/AuthContext";
import { useBackendApi } from "@/api/useBackendApi";

interface Comment {
  id: string;
  userId: string;
  text: string;
  user: {
    name: string;
  };
}

interface CommentsProps {
  comments: Comment[];
}

function Comments({ comments }: CommentsProps) {
  const navigate = useNavigate();
  const authContext = useContext(LoginContext);
  const apiBackend = useBackendApi();
  const [newLikeUpdate, setNewLikeUpdate] = useState(false);
  const { id } = useParams();


  const [rating, setRating] = useState<number>(0);
  const [commentText, setCommentText] = useState<string>("");

  async function newComment(e: FormEvent) {
    e.preventDefault();

    const formData = new FormData(e.target as HTMLFormElement);
    const data = Object.fromEntries(formData);
    const storageData = localStorage.getItem("authToken");
    if (storageData && id) {
      await apiBackend.newComment(storageData, String(data.text), id);
      setNewLikeUpdate(!newLikeUpdate);
    }
  }

  return (
    <div className="mt-10 bg-bgAside p-10">
      <h1 className="text-constrastColor font-semibold text-2xl mb-5">COMENTÁRIOS</h1>

      {authContext.user ? (
        <div className="flex items-center mb-12 gap-4">
          <img className="h-12 w-12 rounded-full object-cover" src="https://i.pinimg.com/236x/93/36/08/93360829e98e2db2aa3ef0d4ae381383.jpg" alt="foto da hello kitty pq não consigo importar a do homelander" />

          <div className="flex flex-col items-center gap-2">
           
            <div className="h-10 text-gray-400 px-3 py-6 bg-slate-900 hover:border-constrastColor transition-all duration-200 border-2 border-slate-400 rounded-sm justify-center flex items-center">
              <p className="text-mainFontColor">
                Quantos kiwis esse filme merece?
              </p>
              {[1, 2, 3, 4, 5].map((index) => (
                <button
                  key={index}
                  type="button"
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${rating >= index ? 'text-yellow-400' : 'text-gray-400'}`}
                  onClick={() => setRating(index)}
                >
                  🥝
                </button>
              ))}
            </div>
          
            <input
              name="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="px-3 h-10 w-full py-8 rounded-sm outline-none border-2 border-slate-400 bg-slate-900 text-slate-400 focus:border-constrastColor transition-all duration-200"
              type="text"
              placeholder="Adicione um novo comentário..."
            />
          </div>

          <form onSubmit={newComment} className="flex gap-3">
            <button type="submit" className="h-10 text-gray-400 px-3 hover:border-constrastColor transition-all duration-200 border-2 border-slate-400 rounded-sm justify-center flex items-center">Avaliar</button>
          </form>
        </div>
      ) : null}

      <div>
        {comments.map((comment) => {
          return (
            <div className="mb-6" key={comment.id}>
              <div className="flex items-center gap-2 text-gray-400">
                <img className="h-12 w-12 rounded-full object-cover" src="https://i.pinimg.com/236x/93/36/08/93360829e98e2db2aa3ef0d4ae381383.jpg" alt="foto da hello kitty pq não consigo importar a do homelander" />
                <p onClick={() => {
                  navigate(`/Profile/${comment.userId}`);
                  window.scrollTo({ top: 0 });
                }} className="font-semibold hover:text-constrastColor hover:underline cursor-pointer transition-all duration-200">{comment.user.name}</p>
              </div>
              <p className="relative left-12 text-gray-400 max-w-[600px]">{comment.text}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Comments;
