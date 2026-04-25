import type { Meta, StoryObj } from "@storybook/react";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
} from "@sym/ui";

const meta: Meta<typeof Command> = { title: "Components/Command", component: Command, tags: ["autodocs"] };
export default meta;
type Story = StoryObj<typeof Command>;

export const Palette: Story = {
  render: () => (
    <div className="w-[360px] rounded-md border border-neutral-100 shadow-md dark:border-[#2a2d3e]">
      <Command>
        <CommandInput placeholder="명령어 검색..." />
        <CommandList>
          <CommandEmpty>결과 없음</CommandEmpty>
          <CommandGroup heading="내비게이션">
            <CommandItem>홈</CommandItem>
            <CommandItem>대시보드</CommandItem>
            <CommandItem>설정</CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="액션">
            <CommandItem>새 문서 만들기</CommandItem>
            <CommandItem>프로필 수정</CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </div>
  ),
};
