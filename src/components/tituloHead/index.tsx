import Head from "next/head";

export default function TituloHead({children}: {children: string}) {

    return (

        <Head>

            <title>{children}</title>

        </Head>

    )

}