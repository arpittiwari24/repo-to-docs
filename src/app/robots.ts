import { MetadataRoute } from "next";

export default function robots() : MetadataRoute.Robots {
    return {
        rules : {
            userAgent: "*",
            allow : ["/"],
            disallow : []
        },
        sitemap : "https://readme-generator.xyz/sitemap.xml"
    }
}