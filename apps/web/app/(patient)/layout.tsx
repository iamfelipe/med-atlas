import { Button } from "@/components/ui/button";
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs/server";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="flex-col">
        <div className="border-b">
          <div className="flex h-16 items-center px-4">
            <h2 className="text-lg font-semibold">Patient Dashboard</h2>
            <div className="ml-auto flex items-center space-x-4">
              <Button variant="outline">
                <LogoutLink>Logout</LogoutLink>
              </Button>
            </div>
          </div>
        </div>
        <div className="flex flex-1 flex-col gap-4 p-8 pt-6">{children}</div>
      </div>
    </>
  );
}
