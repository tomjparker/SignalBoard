export default function Footer () {
    return (
        <footer
        className="container cluster"
        style={{ '--cluster-justify': 'space-between' }}
        >
            <small className="muted">© {new Date().getFullYear()} Tom Parker</small>
            <div className="cluster gap-2">
            <a href="#" className="text-sm">Twitter</a>
            <a href="#" className="text-sm">Discord</a>
            <a href="#" className="text-sm">GitHub</a>
            </div>
        </footer>
    )
}
