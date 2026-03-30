const Loading = () => {
  return (
    <div className="w-screen h-screen bg-neutral-0 dark:bg-neutral-950 flex justify-center items-center">
      <div
        className="h-32 w-32 animate-spin rounded-full border-8 border-solid border-current border-e-transparent text-neutral-500 dark:text-neutral-300"
        role="status"
      >
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
};

export default Loading;
