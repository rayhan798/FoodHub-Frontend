"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Roles } from "@/constants/roles";
import { UtensilsCrossed, Loader2, Info } from "lucide-react";
import { useRegister } from "@/hooks/useRegister";

export function RegisterForm({ ...props }: React.ComponentProps<typeof Card>) {
  const { form, role, setRole, isPending, handleGoogleLogin } = useRegister();

  return (
    <div className="container relative min-h-[calc(100vh-64px)] flex items-center justify-center py-12 px-4">
      <Card className="w-full max-w-[450px] shadow-2xl border-slate-200" {...props}>
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-orange-100 rounded-full">
              <UtensilsCrossed className="h-6 w-6 text-orange-600" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Create an account</CardTitle>
          <CardDescription>Enter your details below to join FoodHub</CardDescription>
        </CardHeader>

        <CardContent>
          <form
            id="register-form"
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              form.handleSubmit();
            }}
          >
            {/* Role Selection */}
            <div className="space-y-3">
              <FieldLabel className="text-sm font-medium">I want to register as a:</FieldLabel>
              <Tabs
                defaultValue={Roles.CUSTOMER}
                className="w-full"
                onValueChange={(value) => setRole(value)}
              >
                <TabsList className="grid w-full grid-cols-2 h-11">
                  <TabsTrigger value={Roles.CUSTOMER} className="data-[state=active]:bg-orange-600 data-[state=active]:text-white">
                    Customer
                  </TabsTrigger>
                  <TabsTrigger value={Roles.PROVIDER} className="data-[state=active]:bg-orange-600 data-[state=active]:text-white">
                    Provider
                  </TabsTrigger>
                </TabsList>
              </Tabs>

              <div className="flex items-start gap-2 p-2 rounded-md bg-slate-50 border border-slate-100">
                <Info className="h-4 w-4 text-slate-400 mt-0.5" />
                <p className="text-xs text-slate-500">
                  {role === Roles.PROVIDER
                    ? "Providers can list meals, manage menus, and receive orders."
                    : "Customers can explore meals, order food, and track deliveries."}
                </p>
              </div>
            </div>

            <FieldGroup className="space-y-4">
              <form.Field name="name">
                {(field) => (
                  <Field>
                    <FieldLabel htmlFor={field.name}>Full Name</FieldLabel>
                    <Input
                      placeholder="John Doe"
                      id={field.name}
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                    <FieldError errors={field.state.meta.errors} />
                  </Field>
                )}
              </form.Field>

              <form.Field name="email">
                {(field) => (
                  <Field>
                    <FieldLabel htmlFor={field.name}>Email Address</FieldLabel>
                    <Input
                      placeholder="m@example.com"
                      type="email"
                      id={field.name}
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                    <FieldError errors={field.state.meta.errors} />
                  </Field>
                )}
              </form.Field>

              <form.Field name="password">
                {(field) => (
                  <Field>
                    <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      id={field.name}
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                    <FieldError errors={field.state.meta.errors} />
                  </Field>
                )}
              </form.Field>
            </FieldGroup>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col gap-4">
          <Button
            disabled={isPending}
            form="register-form"
            type="submit"
            className="w-full bg-orange-600 hover:bg-orange-700 text-white h-11 transition-all"
          >
            {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Create Account"}
          </Button>

          <div className="relative w-full py-2">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or</span>
            </div>
          </div>

          <Button
            onClick={handleGoogleLogin}
            variant="outline"
            type="button"
            className="w-full h-11 border-slate-200 hover:bg-slate-50"
          >
            <GoogleIcon />
            Continue with Google
          </Button>

          <p className="text-sm text-center text-slate-500">
            Already have an account?{" "}
            <Link href="/login" className="text-orange-600 font-semibold hover:underline">
              Log in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}