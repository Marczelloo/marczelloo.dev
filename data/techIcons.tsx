import { DiscordIcon } from "@/components/ui/icons/discord-icon";
import { JsIcon } from "@/components/ui/icons/js-icon";
import { LavalinkIcon } from "@/components/ui/icons/lavalink-icon";
import { NodejsIcon } from "@/components/ui/icons/nodejs-icon";

export const techIcons: Record<string, React.ComponentType<any>> = {
  discord: DiscordIcon,
  nodejs: NodejsIcon,
  javascript: JsIcon,
  lavalink: LavalinkIcon,
};
