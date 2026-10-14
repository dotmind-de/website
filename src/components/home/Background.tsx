import { ArrowLink } from "@/components/ui/Button";
import { SectionHeading, accent } from "@/components/ui/SectionHeading";
import { Timeline } from "./Timeline";

export function Background() {
  return (
    <section aria-labelledby="background-title" className="shell py-28 md:py-40">
      <SectionHeading
        id="background-title"
        index="06"
        label="Background"
        title={["Engineered", accent("foundations,"), "practical focus."]}
        aside={<ArrowLink href="/about">More about me</ArrowLink>}
      />
      <div className="mt-16 md:mt-24">
        <Timeline />
      </div>
    </section>
  );
}
