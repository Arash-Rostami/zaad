import Hero from "../components/Hero";
import Story from "../components/Story";
import Showcase from "../components/Showcase";
import Advantages from "../components/Advantages";
import Materials from "../components/Materials";
import Concierge from "../components/Concierge";
import Blueprint from "../components/Blueprint";
import ShowroomOrchestrator from "../components/ShowroomOrchestrator";

export default function Page() {
    return (
        <ShowroomOrchestrator
            heroSection={<Hero />}
            storySection={<Story />}
            showcaseSection={<Showcase />}
            advantagesSection={<Advantages />}
            materialsSection={<Materials />}
            conciergeSection={<Concierge />}
            blueprintSection={<Blueprint />}
        />
    );
}
