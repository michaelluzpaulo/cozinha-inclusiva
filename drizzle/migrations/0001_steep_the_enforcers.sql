CREATE TABLE "client_recipe_favorites" (
	"client_id" bigint NOT NULL,
	"recipe_id" bigint NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "client_recipe_favorites_pkey" PRIMARY KEY("client_id","recipe_id")
);
--> statement-breakpoint
ALTER TABLE "clients" ALTER COLUMN "id" SET MAXVALUE 9223372036854776000;--> statement-breakpoint
ALTER TABLE "client_recipe_favorites" ADD CONSTRAINT "client_recipe_favorites_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "client_recipe_favorites" ADD CONSTRAINT "client_recipe_favorites_recipe_id_fkey" FOREIGN KEY ("recipe_id") REFERENCES "public"."recipes"("id") ON DELETE cascade ON UPDATE no action;