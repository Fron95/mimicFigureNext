import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Page({image} : {image: string}) {
  return (
    <Avatar>
      
      <AvatarImage src={image} />
      <AvatarFallback>CN</AvatarFallback>
    </Avatar>
  );
}
