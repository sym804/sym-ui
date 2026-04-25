import type { Meta, StoryObj } from "@storybook/react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  Input,
  Button,
} from "@sym/ui";

const schema = z.object({
  username: z.string().min(2, "2자 이상 입력").max(12, "12자 이하 입력"),
  email: z.string().email("유효한 이메일 입력"),
});
type Values = z.infer<typeof schema>;

function RegisterForm() {
  const form = useForm<Values>({ resolver: zodResolver(schema), defaultValues: { username: "", email: "" } });
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit((v) => alert(JSON.stringify(v, null, 2)))} className="w-[320px] space-y-4">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>닉네임</FormLabel>
              <FormControl>
                <Input {...field} placeholder="2~12자" />
              </FormControl>
              <FormDescription>다른 사용자에게 표시됩니다.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>이메일</FormLabel>
              <FormControl>
                <Input {...field} placeholder="name@company.com" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">가입</Button>
      </form>
    </Form>
  );
}

const meta: Meta<typeof RegisterForm> = { title: "Components/Form", component: RegisterForm, tags: ["autodocs"] };
export default meta;
type Story = StoryObj<typeof RegisterForm>;

export const Register: Story = { render: () => <RegisterForm /> };
