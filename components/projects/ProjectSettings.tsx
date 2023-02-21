import React from "react";
import Tabs from "@/components/settings/Tabs";
import { Container, Input } from "../theme";

const ProjectSettings = () => {
  return (
    <div>
      This is Project wise setting
      <Container>
        <Tabs active={"audit"} />
        <Input
          name="name"
          label="Hello"
          placeholder=""
          defaultValue=""
          required={true}
          register={() => "sdsdf"}
        />
      </Container>
    </div>
  );
};

export default ProjectSettings;
