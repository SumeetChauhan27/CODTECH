import { Paperclip } from 'lucide-react';

export default function ImageDropzone() {
  const handleClick = () => {
    alert("File & Image sharing will be added soon!");
  };

  return (
    <div className="relative shrink-0 flex items-center">
      <button
        type="button"
        onClick={handleClick}
        className="p-1.5 text-zinc-400 hover:text-blue-500 transition-colors shrink-0"
        title="Attach a file (Coming soon)"
      >
        <Paperclip className="w-5 h-5" />
      </button>
    </div>
  );
}
