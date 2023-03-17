import Auth from "@/components/auth";
import Container from "@/components/container";
import { NextPage } from "next"



const Index: NextPage = () => {

    return (
        <Container>
            <Auth />
        </Container>
    );
}

export default Index;