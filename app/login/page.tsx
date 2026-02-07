"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Eye, EyeOff, CheckCircle2 } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Multi-step: "login" | "verification" | "forgot" | "forgot-sent"
  const [step, setStep] = useState<"login" | "verification" | "forgot" | "forgot-sent">("login");
  const [forgotEmail, setForgotEmail] = useState("");

  // Cloudflare Turnstile simulation
  const [turnstileStatus, setTurnstileStatus] = useState<"idle" | "verifying" | "success">("idle");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Preencha todos os campos.");
      return;
    }

    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setIsLoading(false);

    // Move to verification step
    setStep("verification");
    // Start Cloudflare simulation
    setTurnstileStatus("verifying");
    setTimeout(() => setTurnstileStatus("success"), 2000);
  };

  const handleContinue = () => {
    if (turnstileStatus !== "success") return;
    window.location.href = "/";
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) return;
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setIsLoading(false);
    setStep("forgot-sent");
  };

  return (
    <div className="min-h-screen bg-secondary flex flex-col">
      {/* Header - Logo */}
      <header className="px-8 py-6">
        <div className="flex items-center gap-2">
          <Image
            src="/logotipo-ata360-preto.png"
            alt="ATA360"
            width={140}
            height={40}
            className="h-8 w-auto"
            priority
          />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-start justify-center px-6 pt-4 pb-12 lg:px-12">
        <div className="w-full max-w-6xl flex items-start gap-10 lg:gap-16">

          {/* Left Side - Form Area */}
          <div className="flex-1 max-w-xl">

            {/* Headline */}
            <div className="text-center mb-10">
              <h1 className="text-4xl lg:text-[42px] font-light text-foreground leading-tight" style={{ fontFamily: "'Georgia', 'Times New Roman', serif", fontStyle: "italic" }}>
                {'Complicado?'}
              </h1>
              <h1 className="text-4xl lg:text-[42px] font-light text-foreground leading-tight" style={{ fontFamily: "'Georgia', 'Times New Roman', serif", fontStyle: "italic" }}>
                {'Simples.'}
              </h1>
            </div>

            {/* Card */}
            <div className="bg-card rounded-2xl border border-border/80 px-8 py-8 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">

              {/* Step: Login */}
              {step === "login" && (
                <>
                  {/* Social Login Buttons */}
                  <div className="flex gap-3 mb-6" role="group" aria-label="Login social">
                    <button aria-label="Entrar com Google" className="flex-1 flex items-center justify-center gap-2.5 h-12 border border-border rounded-xl bg-card hover:bg-muted transition-colors cursor-pointer">
                      <svg className="size-5" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                      </svg>
                      <span className="text-sm font-medium text-foreground">Google</span>
                    </button>
                    <button aria-label="Entrar com Microsoft" className="flex-1 flex items-center justify-center gap-2.5 h-12 border border-border rounded-xl bg-card hover:bg-muted transition-colors cursor-pointer">
                      <svg className="size-5" viewBox="0 0 24 24">
                        <rect x="1" y="1" width="10" height="10" fill="#F25022"/>
                        <rect x="13" y="1" width="10" height="10" fill="#7FBA00"/>
                        <rect x="1" y="13" width="10" height="10" fill="#00A4EF"/>
                        <rect x="13" y="13" width="10" height="10" fill="#FFB900"/>
                      </svg>
                      <span className="text-sm font-medium text-foreground">Microsoft</span>
                    </button>
                  </div>

                  {/* Divider */}
                  <div className="flex items-center gap-4 mb-6">
                    <div className="flex-1 h-px bg-border" />
                    <span className="text-xs text-muted-foreground font-medium">OU</span>
                    <div className="flex-1 h-px bg-border" />
                  </div>

                  {/* Form */}
                  <form onSubmit={handleLogin} className="space-y-5" noValidate>
                    {/* Email */}
                    <div>
                      <label htmlFor="login-email" className="text-sm text-foreground mb-1.5 block">
                        Digite seu e-mail
                      </label>
                      <input
                        id="login-email"
                        type="email"
                        value={email}
                        onChange={(e) => { setEmail(e.target.value); setError(""); }}
                        placeholder="seu@email.com"
                        autoComplete="email"
                        aria-required="true"
                        aria-invalid={error ? "true" : undefined}
                        className="w-full bg-card border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-ring focus:ring-1 focus:ring-ring px-4 py-3 transition-colors"
                      />
                    </div>

                    {/* Password */}
                    <div>
                      <label htmlFor="login-password" className="text-sm text-foreground mb-1.5 block">
                        Senha
                      </label>
                      <div className="relative">
                        <input
                          id="login-password"
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={(e) => { setPassword(e.target.value); setError(""); }}
                          placeholder="Digite sua senha"
                          autoComplete="current-password"
                          aria-required="true"
                          aria-invalid={error ? "true" : undefined}
                          className="w-full bg-card border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-ring focus:ring-1 focus:ring-ring px-4 py-3 pr-12 transition-colors"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                          className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer"
                        >
                          {showPassword ? (
                            <EyeOff className="size-[18px] text-muted-foreground hover:text-foreground transition-colors" />
                          ) : (
                            <Eye className="size-[18px] text-muted-foreground hover:text-foreground transition-colors" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Error */}
                    {error && (
                      <p className="text-xs text-destructive" role="alert">{error}</p>
                    )}

                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full h-12 rounded-xl bg-foreground text-white text-sm font-semibold hover:bg-foreground/90 disabled:opacity-60 transition-colors cursor-pointer"
                    >
                      {isLoading ? (
                        <span className="flex items-center justify-center gap-2">
                          <span className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Entrando...
                        </span>
                      ) : (
                        "Entrar"
                      )}
                    </button>
                  </form>

                  {/* Links */}
                  <div className="flex items-center justify-center gap-6 mt-5">
                    <button
                      onClick={() => { setStep("forgot"); setForgotEmail(email); }}
                      className="text-sm text-foreground hover:underline cursor-pointer"
                    >
                      Esqueceu sua senha?
                    </button>
                    <button className="text-sm text-foreground hover:underline cursor-pointer">
                      Ainda não tem conta?
                    </button>
                  </div>
                </>
              )}

              {/* Step: Verification (Cloudflare Turnstile) */}
              {step === "verification" && (
                <>
                  <div className="text-center mb-6">
                    <h2 className="text-base font-semibold text-foreground mb-1.5">
                      Verificação de Segurança
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Confirme que você não é um robô para continuar
                    </p>
                  </div>

                  {/* Cloudflare Turnstile Widget */}
                  <div className="flex justify-center mb-6">
                    <div className="border border-border rounded-lg px-4 py-3 inline-flex items-center gap-4 bg-card">
                      <div className="flex items-center gap-2.5">
                        {turnstileStatus === "verifying" ? (
                          <div className="size-6 border-2 border-muted border-t-warning rounded-full animate-spin" role="status" aria-label="Verificando" />
                        ) : (
                          <div className="size-6 bg-emerald-500 rounded-full flex items-center justify-center">
                            <CheckCircle2 className="size-4 text-white" />
                          </div>
                        )}
                        <span className="text-sm font-medium text-foreground">
                          {turnstileStatus === "verifying" ? "Verificando..." : "Sucesso!"}
                        </span>
                      </div>
                      <div className="border-l border-border pl-4 flex flex-col items-center">
                        <svg className="h-6 w-auto mb-0.5" viewBox="0 0 100 30" fill="none">
                          <path d="M14.5 3C8 3 3 8 3 14.5S8 26 14.5 26c4.5 0 8.4-2.5 10.4-6.2l-3.2-1.8c-1.3 2.3-3.8 3.8-6.7 3.8C10.7 21.8 7.2 18.3 7.2 14c0-4.3 3.5-7.8 7.8-7.8 2.9 0 5.4 1.5 6.7 3.8l3.2-1.8C22.9 5 18.5 3 14.5 3z" fill="#F6A623"/>
                          <text x="30" y="20" fontSize="12" fontWeight="bold" fill="#333" fontFamily="Arial">CLOUDFLARE</text>
                        </svg>
                        <div className="flex items-center gap-1.5">
                          <a href="#" className="text-[10px] text-primary hover:underline">Privacidade</a>
                          <span className="text-[10px] text-muted-foreground">{'·'}</span>
                          <a href="#" className="text-[10px] text-primary hover:underline">Termos</a>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Legal Text */}
                  <p className="text-sm text-primary text-center leading-relaxed mb-6 px-2">
                    Li e estou ciente dos termos de uso, a política de privacidade,
                    Cookies, LGPD e concordo em usar o ATA360.
                  </p>

                  {/* Continue Button */}
                  <button
                    onClick={handleContinue}
                    disabled={turnstileStatus !== "success"}
                    className="w-full h-12 rounded-xl bg-foreground text-white text-sm font-semibold hover:bg-foreground/90 disabled:opacity-40 transition-colors cursor-pointer"
                  >
                    Continuar
                  </button>
                </>
              )}

              {/* Step: Forgot Password */}
              {step === "forgot" && (
                <>
                  <div className="text-center mb-6">
                    <h2 className="text-base font-semibold text-foreground mb-1.5">
                      Recuperar senha
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Informe seu e-mail para receber o link de recuperação
                    </p>
                  </div>

                  <form onSubmit={handleForgotPassword} className="space-y-5" noValidate>
                    <div>
                      <label htmlFor="forgot-email" className="text-sm text-foreground mb-1.5 block">
                        Digite seu e-mail
                      </label>
                      <input
                        id="forgot-email"
                        type="email"
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        placeholder="seu@email.com"
                        autoComplete="email"
                        autoFocus
                        aria-required="true"
                        className="w-full bg-card border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-ring focus:ring-1 focus:ring-ring px-4 py-3 transition-colors"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading || !forgotEmail}
                      className="w-full h-12 rounded-xl bg-foreground text-white text-sm font-semibold hover:bg-foreground/90 disabled:opacity-60 transition-colors cursor-pointer"
                    >
                      {isLoading ? (
                        <span className="flex items-center justify-center gap-2">
                          <span className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Enviando...
                        </span>
                      ) : (
                        "Enviar link"
                      )}
                    </button>
                  </form>

                  <div className="text-center mt-5">
                    <button
                      onClick={() => setStep("login")}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                    >
                      Voltar ao login
                    </button>
                  </div>
                </>
              )}

              {/* Step: Forgot Password Sent */}
              {step === "forgot-sent" && (
                <div className="text-center py-4">
                  <div className="size-12 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="size-6 text-emerald-600" />
                  </div>
                  <h2 className="text-base font-semibold text-foreground mb-1.5">
                    E-mail enviado
                  </h2>
                  <p className="text-sm text-muted-foreground mb-1">
                    Enviamos um link de recuperação para
                  </p>
                  <p className="text-sm font-medium text-foreground mb-6">
                    {forgotEmail}
                  </p>
                  <p className="text-xs text-muted-foreground mb-6">
                    Verifique sua caixa de entrada e spam. O link expira em 30 minutos.
                  </p>
                  <button
                    onClick={() => { setStep("login"); setForgotEmail(""); }}
                    className="w-full h-12 rounded-xl bg-foreground text-white text-sm font-semibold hover:bg-foreground/90 transition-colors cursor-pointer"
                  >
                    Voltar ao login
                  </button>
                </div>
              )}
            </div>

            {/* App Download Section */}
            <div className="text-center mt-8">
              <p className="text-sm text-muted-foreground mb-4">
                Baixe o app e tenha acesso completo
              </p>
              <div className="flex items-center justify-center gap-3">
                {/* App Store Badge */}
                <a href="#" className="inline-flex items-center gap-2 bg-foreground text-white rounded-xl px-4 py-2.5 hover:bg-foreground/90 transition-colors">
                  <svg className="size-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                  </svg>
                  <div className="text-left">
                    <div className="text-[9px] leading-none opacity-70">Baixar na</div>
                    <div className="text-xs font-semibold leading-tight">App Store</div>
                  </div>
                </a>
                {/* Google Play Badge */}
                <a href="#" className="inline-flex items-center gap-2 bg-foreground text-white rounded-xl px-4 py-2.5 hover:bg-foreground/90 transition-colors">
                  <svg className="size-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 0 1-.61-.92V2.734a1 1 0 0 1 .609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.198l2.807 1.626a1 1 0 0 1 0 1.73l-2.808 1.626L15.206 12l2.492-2.491zM5.864 2.658L16.802 8.99l-2.303 2.303-8.635-8.635z"/>
                  </svg>
                  <div className="text-left">
                    <div className="text-[9px] leading-none opacity-70">Disponível no</div>
                    <div className="text-xs font-semibold leading-tight">Google Play</div>
                  </div>
                </a>
              </div>
            </div>
          </div>

          {/* Right Side - Wave Art Image */}
          <div className="hidden lg:block flex-1 max-w-lg pt-6">
            <div className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden">
              <Image
                src="/login-wave-art.jpg"
                alt="Abstract blue wave art"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
