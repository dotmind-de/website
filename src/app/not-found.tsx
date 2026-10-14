import { ButtonLink } from "@/components/ui/Button";
import { PageHeader } from "@/components/ui/PageHeader";

export default function NotFound() {
  return (
    <>
      <title>Page not found — dotMind</title>
      <meta name="robots" content="noindex" />
      <PageHeader
      eyebrow={<span className="text-ember">(404)</span>}
      lines={[
        "Nothing",
        <>
          <span className="serif-accent font-normal">here.</span>
        </>,
      ]}
      intro="The page you were looking for doesn't exist or has moved."
    >
      <div className="mt-12 flex flex-wrap gap-3">
        <ButtonLink href="/">Back home</ButtonLink>
        <ButtonLink href="/projects" variant="ghost">
          See the work
        </ButtonLink>
      </div>
      </PageHeader>
    </>
  );
}
