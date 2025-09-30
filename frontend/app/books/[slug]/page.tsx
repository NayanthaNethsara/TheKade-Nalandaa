import Reader from "@/components/book/reader";

interface BookDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function BookDetailPage({ params }: BookDetailPageProps) {
  const slug = (await params).slug;

  // Split slug into ID and name
  const [idPart, ...nameParts] = slug.split("-");
  const bookId = idPart;
  const bookName = nameParts.join("-");

  return <Reader bookId={bookId} bookName={bookName} />;
}
