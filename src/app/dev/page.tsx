"use client";
import { Button, Link } from "@/components/ui";
import Drawer from "@/components/ui/drawer/Drawer";
import { BrandIcon } from "@/components/ui/icon/BrandIcons";
import IconsLibrary from "@/components/ui/icon/IconsLibrary";

const DevPage = () => {
  return (
    <div className="w-full min-h-screen">
      <div className="flex flex-col justify-center items-center gap-4">
        <Button>Click me here</Button>
        <Button variant="secondary" size="lg">
          Click me here
        </Button>
        <Link href={"/"} underline="left">
          visit home
        </Link>
        <Link href={"/"} variant="primary-button">
          visit home
        </Link>
        <Link href={"/"} variant="secondary-button">
          visit home
        </Link>
        <Drawer
          isOpen={false}
          onClose={() => {
            console.log("close");
          }}
          title="Hello"
          footer={<div>footer</div>}
          origin="right"
        >
          Hello
        </Drawer>

        <div className="flex gap-6 ">
          <IconsLibrary name="github" />
          <IconsLibrary name="instagram" size={24} />
          <IconsLibrary name="home" size={56} className="text-primary" />

          <BrandIcon name="facebook" size={56} />
          <BrandIcon name="whatsapp" className="text-primary" />
        </div>
      </div>
    </div>
  );
};

export default DevPage;
